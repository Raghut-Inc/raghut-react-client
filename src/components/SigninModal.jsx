import { Modal } from "antd";
import React from "react";
import GoogleSignUp from "./GoogleSignUp";
import { TypeAnimation } from "react-type-animation";

const SigninModal = ({ setOpen, open }) => {
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        width={600}
        open={open}
        title=""
        closeIcon={null}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={[]}
      >
        <div className="w-full h-full py-6 flex flex-col items-center space-y-4">
          <TypeAnimation sequence={["Welcome to Raghut"]} speed={50} className="text-2xl font-semibold" />
          <p className="text-center text-gray-500 text-sm max-w-md">
            Easily search and explore your files. Just upload your documents, and we’ll handle the rest!
          </p>
          <ul className="text-gray-600 text-left text-sm max-w-md space-y-1">
            <li>✨ Find what you need quickly.</li>
            <li>📁 Supports PDFs, Word docs, and more.</li>
            <li>🔐 You control who can see your data.</li>
          </ul>
          <GoogleSignUp />
        </div>
      </Modal>
    </>
  );
};

export default SigninModal;
