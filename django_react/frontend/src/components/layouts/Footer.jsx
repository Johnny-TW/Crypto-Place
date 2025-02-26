import React from 'react';
import '../../styles/views/footer.scss';

function Footer() {
  return (
    <div className="content-footer">
      <footer className="text-center inset-shadow-2xs py-4 w-full bottom-0">
        <div className="flex justify-center items-center">
          <small className="text-gray-950 text-sm">
            Copyright &copy; 2025 CrptoCoin All Rights
            Reserved | Developer : Johnny Yeh
          </small>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
