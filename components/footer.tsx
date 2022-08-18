import React from "react";
import Image from "next/image";

interface footerProps {}

const Footer: React.FC<footerProps> = ({}) => {
  return (
    <footer className="fixed top-0 w-full text-center grid place-content-center mt-20">
      <div>Built using</div>
      <div>
        <a
          href="https://open.spotify.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative grid lg:w-210 lg:h-63 m-4 w-105 h-32"
        >
          <Image src="/spotify.png" layout="fill" priority />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
