import React from 'react';
import '../../styles/views/footer.scss';

function Footer() {
  return (
    <div className="content-footer">
      <footer className="bg-purple-customPurple text-center py-4 shadow-inner w-full fixed bottom-0">
        <div className="flex justify-center items-center">
          <small className="text-white text-sm">
            Copyright &copy; 2024 Wistron All Rights Reserved | Front-End: Johnny Yeh / Back-End: Even
          </small>
        </div>
      </footer>
    </div>
  );
}

export default Footer;