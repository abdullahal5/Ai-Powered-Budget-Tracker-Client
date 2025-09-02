import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { steps } from "../../data/howItWorks";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            How BudgetAI Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get started with intelligent budgeting in four simple steps. Our AI
            does the heavy lifting while you focus on your financial goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-border z-0" />
              )}

              <Card className="relative z-10 bg-card border-border hover:shadow-lg transition-all duration-300 text-center">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full">
                        <step.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-accent-foreground">
                          {step.step}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-card-foreground">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
