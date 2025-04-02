import React from "react";

const Terms = () => {
  const WelcomeSection = () => (
    <div className="w-full flex justify-center relative">
      <div className="max-w-screen-lg w-full h-full flex items-center px-4 md:px-16 z-20 text-center py-20">
        <div className="w-full flex flex-col justify-center items-center text-gray-700 break-keep">
          <h1 className="font-bold text-5xl md:text-5xl leading-tight">Terms of Service</h1>
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
          <p className="mb-4">
            RAGHut, Inc. (hereinafter referred to as 'RAGHut', 'Company', 'we', or 'us') provides the services
            (collectively, the 'Service') including the websites under the RAGHut.com domain, SaaS products, web design
            software, tools, and related services. These terms and conditions constitute a legal agreement between you
            and us and apply to your use of the Service. Please read and understand these terms of service carefully
            before using the Service.
          </p>

          <h2 className="text-2xl font-semibold my-4">2. Acknowledgement and Acceptance of Terms</h2>
          <p className="mb-4">
            By using the Service, you agree to comply with the posted guidelines or rules applicable to the Service.
            Your use of the Service or access to the Site constitutes your agreement to these Terms of Service and
            Privacy Policy. If you do not agree to these terms, your use of the Service may be restricted.
          </p>

          <h2 className="text-2xl font-semibold my-4">3. Eligibility</h2>
          <p className="mb-4">
            The Service is only available to individuals aged 13 and older. If you are between the ages of 13 and under
            18 or under the legal age of majority in your jurisdiction of residence, you must review these Terms of
            Service with your parent or legal guardian and your parent or legal guardian must understand and agree to
            these Terms of Service. If you do not have the legal capacity to agree to these Terms of Service, your use
            of the Service may be restricted.
          </p>

          <h2 className="text-2xl font-semibold my-4">4. Account Information</h2>
          <p className="mb-4">
            To use the Service, you must register and create an account (including name, password, and email address).
            If you upgrade your account, you must also provide payment information. Through your RAGHut account, you may
            have access to services and features that we periodically establish and maintain. You are responsible for
            maintaining accurate and up-to-date account information. We are not responsible for any problems arising
            from inaccurate information provided by you.
          </p>

          <h2 className="text-2xl font-semibold my-4">5. Ownership</h2>
          <p className="mb-4">
            Except for user content, all materials and the Service itself, and all intellectual property rights therein
            or related thereto (collectively, the 'Content'), are owned by RAGHut or its licensors and are protected by
            copyright, trademark, and other intellectual property laws. By using the Service, you grant RAGHut the right
            to use the content.
          </p>

          <h2 className="text-2xl font-semibold my-4">6. User Content</h2>
          <p className="mb-4">
            You may post or upload content on the Service, and you retain all intellectual property rights in such user
            content. RAGHut has no obligation to store, maintain, or provide copies of user content. However, by using
            the Service, you grant RAGHut a free, perpetual, worldwide license to use, reproduce, modify, publicly
            display, distribute, and perform the user content. This license includes the right for RAGHut to use,
            reproduce, modify, publicly display, distribute, and perform the user content in order to provide and
            improve the Service.
          </p>

          <h2 className="text-2xl font-semibold my-4">7. Rules</h2>
          <p className="mb-4">
            Your use of the Service must comply with all applicable laws and regulations. You may not access, acquire,
            copy, or monitor any part of the Service using 'deep-link', 'page scrape', 'robot', 'spider', or similar
            technologies. By using the Service, you agree not to engage in the following activities:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Posting illegal, threatening, defamatory, obscene, abusive, vulgar, or violent content</li>
            <li>Collecting, storing, disclosing, or using other users' personal information</li>
            <li>Posting content that infringes upon copyrights, trademarks, or other intellectual property rights</li>
            <li>Engaging in actions that compromise the security, integrity, or availability of the Service</li>
            <li>Interfering with the normal operation of the Service</li>
            <li>Accessing another user's account without permission or impersonating another user</li>
            <li>Posting unnecessary or inappropriate content such as spam, advertisements, chain mail, or scams</li>
            <li>Violating legal obligations, contracts, or restrictions</li>
          </ul>

          <h2 className="text-2xl font-semibold my-4">8. Third-Party Content</h2>
          <p className="mb-4">
            RAGHut may provide links to third-party websites. We do not endorse or warrant the content of these
            third-party websites and we are not responsible for their content. By visiting third-party websites or using
            third-party content, you do so at your own risk and we shall not be liable for any issues arising from such
            use.
          </p>

          <h2 className="text-2xl font-semibold my-4">9. Billing and Payment</h2>
          <p className="mb-4">
            Users of the Service may be required to provide credit card information to the Company or a payment service
            provider ('PSP') designated by the Company. You are responsible for paying the agreed-upon fees for the
            Service. You are solely responsible for any costs associated with your use of the Service.
          </p>

          <h2 className="text-2xl font-semibold my-4">10. Privacy</h2>
          <p className="mb-4">
            Our Privacy Policy applies to your use of the Service and is incorporated by reference as part of these
            Terms of Service. By using the Service, you consent to the collection, use, and disclosure of your personal
            information. Your personal information will be processed in accordance with our Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold my-4">11. Disclaimer of Warranties and Limitation of Liability</h2>
          <p className="mb-4">
            The Service and all content are provided 'as is' and 'as available' without any kind of warranty, either
            express or implied. We shall not be liable for any issues arising from your use of the Service.
          </p>

          <h2 className="text-2xl font-semibold my-4">AI Disclaimer</h2>
          <p className="mb-4">
            RAGHut' AI technology generates and delivers content automatically based on specific events and user
            interactions. You are solely responsible for the use of AI technology. We shall not be liable for any issues
            arising from your use of AI features.
          </p>

          <h2 className="text-2xl font-semibold my-4">Emergency Services Contact</h2>
          <p className="mb-4">
            The Service is not intended for use in contacting emergency services or obtaining immediate emergency
            assistance. In case of an emergency, you should immediately contact the appropriate emergency services in
            your area or seek direct assistance from local authorities.
          </p>

          <h2 className="text-2xl font-semibold my-4">12. Changes, Termination, and Liability</h2>
          <p className="mb-4">
            RAGHut is constantly innovating to provide new features and services. Therefore, we may change, add, or
            discontinue the Service at any time without prior notice. We shall not be liable for any issues arising from
            your dissatisfaction with service changes or the termination of the Service.
          </p>

          <h2 className="text-2xl font-semibold my-4">13. Copyright Policy</h2>
          <p className="mb-4">
            RAGHut respects the intellectual property rights of others and expects users to do the same. If you believe
            that any material on the Service infringes upon copyright or other intellectual property rights, please
            provide the following information to RAGHut. We shall not be liable for any issues arising from copyright or
            intellectual property infringement.
          </p>

          <h2 className="text-2xl font-semibold my-4">15. Dispute Resolution</h2>
          <p className="mb-4">
            To facilitate the resolution of any disputes, claims, or controversies ('Disputes') arising out of or in
            connection with this agreement, you and RAGHut agree to first attempt to negotiate any Dispute informally.
            If the negotiation fails, you and we may pursue legal action to resolve the Dispute.
          </p>

          <h2 className="text-2xl font-semibold my-4">16. Miscellaneous</h2>
          <p className="mb-4">
            This agreement and the rights and licenses granted hereunder may not be transferred or assigned by you, but
            may be freely assigned by RAGHut. These Terms of Service constitute the entire agreement between you and us
            and supersede any other provisions not explicitly stated herein.
          </p>
        </div>
      </div>
    </>
  );
};

export default Terms;
