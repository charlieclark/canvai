import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function PageContainer({
  children,
  title,
  description,
}: PageContainerProps) {
  return (
    <div className="container mx-auto px-4 pb-24 pt-16 min-h-[80vh]">
      <div className="mx-auto max-w-3xl">
        <Card className="mb-8 bg-gradient-to-br from-background to-muted">
          <CardHeader>
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          </CardHeader>
          {description && (
            <CardContent>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            </CardContent>
          )}
        </Card>
        <div className="prose prose-gray max-w-none px-4 dark:prose-invert">
          {children}
        </div>
      </div>
    </div>
  );
}
