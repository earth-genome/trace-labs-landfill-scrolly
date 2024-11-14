export default function VisibleTextBlock({
  currentStepCondition,
}: {
  currentStepCondition: any;
}) {
  return (
    <p
      className="h-[200px]"
      style={{ display: currentStepCondition  ? "block" : "none" }}
    >
      {currentStepCondition}
    </p>
  );
}
