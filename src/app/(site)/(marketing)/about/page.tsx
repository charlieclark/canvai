import { PageContainer } from "@/components/shared/page-container";

export const metadata = {
  title: "About Us | Boilerplate",
  description: "Learn more about Boilerplate and our mission to bring stories to life with AI.",
};

export default function AboutPage() {
  return (
    <PageContainer
      title="About Us"
      description="Learn about our mission to make storytelling magical and accessible for everyone"
    >
      <h2>Our Mission</h2>
      <p>
        At Boilerplate, we're dedicated to making storytelling magical and accessible for everyone. 
        Our platform combines the power of AI with human creativity to transform simple images and notes 
        into beautiful, engaging storybooks that captivate readers of all ages.
      </p>

      <h2>What We Do</h2>
      <p>
        We provide an innovative platform that allows users to create personalized storybooks in minutes. 
        Simply upload an image, add some notes about your story, and our AI will help craft a unique 
        narrative complete with illustrations. Whether you're a parent creating bedtime stories, 
        a teacher making educational content, or someone who loves to tell stories, Boilerplate makes 
        it easy and fun.
      </p>

      <h2>Our Values</h2>
      <ul>
        <li>
          <strong>Creativity:</strong> We believe in empowering everyone to tell their stories, 
          no matter their writing experience.
        </li>
        <li>
          <strong>Innovation:</strong> We continuously evolve our AI technology to create more 
          engaging and personalized stories.
        </li>
        <li>
          <strong>Accessibility:</strong> We're committed to making storytelling tools available 
          to everyone, regardless of technical expertise.
        </li>
        <li>
          <strong>Quality:</strong> We maintain high standards for our AI-generated content, 
          ensuring every story is unique and engaging.
        </li>
      </ul>

      <h2>Join Our Story</h2>
      <p>
        Whether you're looking to create bedtime stories for your children, educational content 
        for your classroom, or simply want to bring your creative ideas to life, Boilerplate is 
        here to help. Join us in making storytelling more accessible and magical, one story at a time.
      </p>
    </PageContainer>
  );
} 