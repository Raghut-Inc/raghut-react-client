import React from "react";

const Privacy = () => {
  const WelcomeSection = () => (
    <div className="w-full flex justify-center relative">
      <div className="max-w-screen-lg w-full h-full flex items-center px-4 md:px-16 z-20 text-center py-20">
        <div className="w-full flex flex-col justify-center items-center text-gray-700 break-keep">
          <h1 className="font-bold text-5xl md:text-5xl leading-tight">Privacy Policy</h1>
          <h2 className="mt-8 md:mt-10 break-keep text-base md:text-lg text-gray-500 leading-relaxed">
            Last Updated: October 17, 2024
          </h2>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="container px-4 text-lg text-gray-600 break-keep w-full flex flex-col items-center mb-20 pt-32">
        <WelcomeSection />
        <div className="max-w-screen-lg w-full h-full flex flex-col px-4 md:px-16 z-20">
          <h2 className="text-2xl font-semibold my-4">Introduction</h2>
          <p className="mb-4">
            RAGHut, Inc. (hereinafter referred to as 'RAGHut', 'Company', 'we', or 'us') values the privacy of visitors
            and customers. We actively protect and manage the information collected through RAGHut.com and its
            affiliated websites ('Sites') and our SaaS products, web design software, tools, and related services.
          </p>

          <h2 className="text-2xl font-semibold my-4">Personal Information Definition</h2>
          <p className="mb-4">
            In this policy, 'personal information' refers to information that can directly or indirectly identify an
            individual. RAGHut does not sell, rent, or lease personal information to third parties. 'Usage data' refers
            to encrypted or anonymized information that does not include personally identifiable information and helps
            understand service usage trends.
          </p>

          <h2 className="text-2xl font-semibold my-4">Collection, Use, and Sharing</h2>
          <p className="mb-4">
            During service registration, we may request personal information such as name, email address, and payment
            information. All information provided during site usage may be used for the operation, improvement, and
            personalization of RAGHut services. Additionally, we may share information with third parties for service
            improvement and marketing purposes.
          </p>

          <h2 className="text-2xl font-semibold my-4">Third-Party Data Sharing</h2>
          <p className="mb-4">
            RAGHut may collect personal information from third parties, but only when it is essential for service
            provision. Through collaboration with third-party service providers, we enhance service quality and improve
            user experience.
          </p>

          <h2 className="text-2xl font-semibold my-4">User Rights</h2>
          <p className="mb-4">
            Users have the right to access, modify, and delete their personal information at any time. RAGHut respects
            such requests and complies with applicable legal requirements.
          </p>

          <h2 className="text-2xl font-semibold my-4">Data Security</h2>
          <p className="mb-4">
            RAGHut uses industry-standard security measures to ensure the safety and security of personal information.
            However, no transmission over the internet can be guaranteed to be 100% secure, and the responsibility for
            the security of transmitted data lies with the user.
          </p>

          <h2 className="text-2xl font-semibold my-4">International Transfers</h2>
          <p className="mb-4">
            RAGHut operates globally and complies with data protection laws of various countries. International data
            transfers are conducted in a manner that complies with the laws of the respective countries.
          </p>

          <h2 className="text-2xl font-semibold my-4">Changes to Policy</h2>
          <p className="mb-4">
            This policy may be modified as needed. In the event of significant changes, we will notify through the
            website or email. If you do not agree with the policy changes, you should discontinue using the service.
          </p>

          <h2 className="text-2xl font-semibold my-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about the privacy policy or RAGHut' handling of personal information, please
            contact us at andrew@raghut.com.
          </p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
