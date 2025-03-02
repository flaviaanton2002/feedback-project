import Question from "../components/Question";

export default function Help() {
  const email = "support@feedback.com";
  return (
    <div className="mt-16">
      <h1 className="text-center text-4xl mb-6">Help center</h1>
      <p className="text-center mb-8">
        Check our FAQ or drop us an email: {email}
      </p>
      <Question question="Can I cancel my subscription anytime?">
        Yes, you can downgrade in your account page.
      </Question>
      <Question question="Can I use the free version forever?">Yes.</Question>
      <Question question="How can I contact support?">
        Send us an email: {email}
      </Question>
    </div>
  );
}
