import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ONBOARDING_STEPS, type OnboardingStep } from "@/types/onboarding";

interface OnboardingCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  currentStep: OnboardingStep;
  isLoading?: boolean;
  onNext?: () => void;
  hideButtonOnLoad?: boolean;
}

export function OnboardingCard({
  title,
  description,
  children,
  currentStep,
  isLoading,
  onNext,
  hideButtonOnLoad,
}: OnboardingCardProps) {
  const currentStepIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="mt-4 flex justify-between">
          {ONBOARDING_STEPS.map((step, index) => (
            <div key={step} className="relative flex flex-1">
              <div
                className={`h-0.5 w-full ${
                  index <= currentStepIndex ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      <CardFooter className="flex justify-between">
        {!(isLoading && hideButtonOnLoad) && (
          <Button onClick={onNext} disabled={isLoading}>
            {isLoading ? "Saving..." : isLastStep ? "Complete" : "Continue"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
