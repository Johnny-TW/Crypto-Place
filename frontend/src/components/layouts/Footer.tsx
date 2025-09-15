import '../../styles/views/footer.scss';
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from 'react-icons/bs';
import cryptoLogoImage from '../../images/svg/ENBG_favicon.svg';

function Footer() {
  return (
    <footer className='bg-white-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          <div className='col-span-1'>
            <div className='flex items-center mb-4'>
              <img
                src={cryptoLogoImage}
                alt='Company Logo'
                className='h-8 w-auto mr-3'
              />
              <span className='self-center text-xl font-semibold whitespace-nowrap'>
                Your Company
              </span>
            </div>
            <p className='text-gray-400 mb-4 text-sm'>
              Making the world a better place through constructing elegant
              hierarchies.
            </p>
          </div>

          <div className='col-span-1'>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-gray-900 transition-colors text-sm'
                >
                  Crypto coins
                </a>
              </li>
            </ul>
          </div>

          <div className='col-span-1'>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-gray-900 transition-colors text-sm'
                >
                  Crypto Exchanges
                </a>
              </li>
            </ul>
          </div>

          <div className='col-span-1'>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-gray-900 transition-colors text-sm'
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-gray-900 transition-colors text-sm'
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-gray-900 transition-colors text-sm'
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-gray-900 transition-colors text-sm'
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t text-gray-700'>
          <div className='flex flex-wrap justify-between'>
            <div className='flex space-x-6 justify-center'>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                <BsFacebook className='h-5 w-5' />
                <span className='sr-only'>Facebook</span>
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                <BsInstagram className='h-5 w-5' />
                <span className='sr-only'>Instagram</span>
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                <BsTwitter className='h-5 w-5' />
                <span className='sr-only'>Twitter</span>
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                <BsGithub className='h-5 w-5' />
                <span className='sr-only'>GitHub</span>
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                <BsDribbble className='h-5 w-5' />
                <span className='sr-only'>Dribbble</span>
              </a>
            </div>
            <div className='flex space-x-6 justify-center'>
              <p className='text-sm text-gray-400'>
                &copy; {new Date().getFullYear()} Your Company. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
