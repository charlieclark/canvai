import { PageContainer } from "@/components/shared/page-container";

export const metadata = {
  title: "About | CanvAi",
  description:
    "Learn about CanvAI—the infinite canvas where rough sketches become polished AI art.",
};

export default function AboutPage() {
  return (
    <PageContainer
      title="About CanvAi"
      description="The infinite canvas where rough sketches become polished AI art"
    >
      <h2>Our Vision</h2>
      <p>
        CanvAi was born from a simple idea: what if creating AI art was as
        natural as sketching on paper? We built an infinite canvas that bridges
        the gap between your creative vision and AI-powered image generation.
      </p>

      <h2>How It Works</h2>
      <p>
        CanvAi combines the freedom of a digital canvas with the power of
        generative AI. Sketch rough ideas, compose frames from shapes and
        images, then transform them into polished artwork using our fine-tuned
        Nano Banana Pro model—all in one seamless workflow.
      </p>
      <ul>
        <li>
          <strong>Infinite Canvas:</strong> A boundless workspace where you can
          pan, zoom, and arrange ideas without limits
        </li>
        <li>
          <strong>Frame Composition:</strong> Compose multiple elements into
          frames ready for AI transformation
        </li>
        <li>
          <strong>Nano Banana Pro:</strong> Our fine-tuned model converts your
          compositions into stunning visuals
        </li>
        <li>
          <strong>Asset Generation:</strong> Create standalone characters,
          objects, and backgrounds to reuse across your projects
        </li>
      </ul>

      <h2>Powered by AI</h2>
      <p>
        We use cutting-edge AI models to power image generation. With CanvAi
        Pro, you get 200 credits per month to bring your creative visions to
        life—no complex setup required.
      </p>

      <h2>Built for Creators</h2>
      <p>
        Whether you&apos;re a concept artist exploring ideas, a game developer
        creating assets, or just someone who loves to experiment with AI
        art—CanvAi gives you the tools to move from rough sketch to polished
        output in seconds.
      </p>

      <h2>Get in Touch</h2>
      <p>
        Have questions or feedback? We&apos;d love to hear from you at{" "}
        <a
          href="mailto:hello@canvai.co"
          className="text-primary hover:underline"
        >
          hello@canvai.co
        </a>
        .
      </p>
    </PageContainer>
  );
}
