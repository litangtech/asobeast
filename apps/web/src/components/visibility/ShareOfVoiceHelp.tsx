import { UiText } from "@/components/language/UiLanguage";
import { InfoTip } from "@/components/ui/info-tip";
import { SHARE_EXAMPLE } from "./share-of-voice-help";
import { SHARE_OF_VOICE_GUIDE } from "./visibility-help";

export function ShareOfVoiceHelp() {
  const [first, second] = SHARE_EXAMPLE.rivals;
  return (
    <InfoTip
      label="About share of voice"
      title="How share of voice is calculated"
      summary="Your visibility as a share of the visibility of your app and the competitors you track, over the same keywords and on the same day."
    >
      <p className="text-muted-foreground">
        <UiText
          message="With a visibility of {0} against competitors at {1} and {2}, your share of voice is {3}; against the first alone it is {4}."
          values={[
            SHARE_EXAMPLE.you,
            first,
            second,
            SHARE_EXAMPLE.share,
            SHARE_EXAMPLE.againstOne,
          ]}
        />
      </p>
      <p className="text-muted-foreground">
        <UiText message="Only competitors checked that day count, so adding one does not rewrite earlier days. Non branded leaves out the keywords classed as your brand or a competitor's." />
      </p>
      <a
        href={SHARE_OF_VOICE_GUIDE}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-foreground underline decoration-primary underline-offset-4 hover:decoration-2"
      >
        <UiText message="Read how share of voice is counted" />
      </a>
    </InfoTip>
  );
}
