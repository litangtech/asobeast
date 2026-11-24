"use client";

import { UiDate } from "@/components/language/UiFormat";
import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import type { WorkspaceInviteCreated } from "@asobeast/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/components/auth/use-auth";
import { ApiError, inviteMember, removeMember, revokeInvite } from "@/lib/api";
import {
  invalidateWorkspaceTeamMutation,
  workspaceTeamOptions,
} from "@/lib/queries";
import { useSingleFlight } from "@/lib/single-flight";
import { inviteOutcome } from "./invite-outcome";

function messageOf(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.envelope.message : fallback;
}

function InviteDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [created, setCreated] = useState<WorkspaceInviteCreated | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => inviteMember(email.trim()),
    onSuccess: (invite) => {
      setCreated(invite);
      setEmail("");
      invalidateWorkspaceTeamMutation(queryClient);
    },
    onError: (err) =>
      setError(messageOf(err, "Could not send the invitation.")),
  });
  const inviteOnce = useSingleFlight(mutation);

  const outcome = created ? inviteOutcome(created) : null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    inviteOnce();
  }

  function change(next: boolean) {
    setOpen(next);
    if (!next) {
      setCreated(null);
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus />
          <UiText message="Invite member" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <UiText message="Invite a member" />
          </DialogTitle>
          <DialogDescription>
            <UiText message="They join this workspace and see everything in it except billing." />
          </DialogDescription>
        </DialogHeader>
        {outcome ? (
          <DialogBody className="gap-2">
            <p className="text-body">{outcome.message}</p>
            {outcome.link ? (
              <code className="rounded-md bg-muted px-2 py-1.5 text-caption break-all">
                {outcome.link}
              </code>
            ) : null}
          </DialogBody>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-col gap-4">
            <DialogBody>
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-email">
                  <UiText message="Email" />
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={error !== null}
                  required
                />
              </div>
              {error ? (
                <p className="text-body text-destructive">{error}</p>
              ) : null}
            </DialogBody>
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                <UiText message="Send invitation" />
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function TeamCard() {
  const { text: uiLabel } = useUiLanguage();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: team } = useQuery(workspaceTeamOptions);
  const isOwner = user?.role === "owner";

  const revoke = useMutation({
    mutationFn: revokeInvite,
    onSuccess: () => {
      toast.success(uiLabel("Invitation revoked"));
      invalidateWorkspaceTeamMutation(queryClient);
    },
    onError: (err) =>
      toast.error(messageOf(err, "Could not revoke the invitation.")),
  });
  const revokeOnce = useSingleFlight(revoke);

  const remove = useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      toast.success(uiLabel("Member removed"));
      invalidateWorkspaceTeamMutation(queryClient);
    },
    onError: (err) =>
      toast.error(messageOf(err, "Could not remove the member.")),
  });
  const removeOnce = useSingleFlight(remove);

  if (!team) return null;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle>
            <UiText message="Team" />
          </CardTitle>
          <CardDescription>
            <UiText message="Everyone who can sign in to this workspace." />
          </CardDescription>
        </div>
        {isOwner ? <InviteDialog /> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableCaption>
            <UiText message="Members of this workspace" />
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>
                <UiText message="Email" />
              </TableHead>
              <TableHead>
                <UiText message="Role" />
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <UiText message="Joined" />
              </TableHead>
              {isOwner ? (
                <TableHead className="w-10">
                  <span className="sr-only">
                    <UiText message="Actions" />
                  </span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="break-all whitespace-normal">
                  {member.email}
                </TableCell>
                <TableCell className="capitalize">{member.role}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <UiDate value={member.createdAt} />
                </TableCell>
                {isOwner ? (
                  <TableCell>
                    {member.role === "owner" ? null : (
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={uiLabel("Remove {0}", [member.email])}
                        disabled={remove.isPending}
                        onClick={() => removeOnce(member.id)}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {team.invites.length > 0 ? (
          <Table>
            <TableCaption>
              <UiText message="Invitations waiting to be accepted" />
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <UiText message="Email" />
                </TableHead>
                <TableHead>
                  <UiText message="Expires" />
                </TableHead>
                {isOwner ? (
                  <TableHead className="w-10">
                    <span className="sr-only">
                      <UiText message="Actions" />
                    </span>
                  </TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell className="break-all whitespace-normal">
                    {invite.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      <UiDate value={invite.expiresAt} />
                    </Badge>
                  </TableCell>
                  {isOwner ? (
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={uiLabel("Revoke the invitation for {0}", [
                          invite.email,
                        ])}
                        disabled={revoke.isPending}
                        onClick={() => revokeOnce(invite.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
}
