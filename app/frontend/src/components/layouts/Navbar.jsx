import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  DisclosurePanel,
} from '@headlessui/react';

import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { logoutRequest } from '../../redux/saga/auth';

const Cryptocurrencies = [{ name: 'Crypto Coins', href: '/dashboard' }];

const Exchanges = [{ name: 'Crypto Exchanges', href: '/exchanges' }];

const NFT = [{ name: 'NFT Dashboard', href: '/NFTDashboard' }];

const Learn = [
  { name: 'Crypto News', href: '/CryptoNews' },
  { name: 'API', href: '/api' },
];

// const LogOut = [{ name: 'Log out', href: '#', icon: ArrowLeftOnRectangleIcon }];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(state => state.auth || {});

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  // Generate employee data from auth user - memoized to prevent unnecessary re-renders
  const employee = useMemo(
    () => [
      {
        name: 'Name',
        description: user?.chName || user?.enName || user?.name || 'Loading...',
      },
      {
        name: 'Employee ID',
        description: user?.emplId || 'Loading...',
      },
      {
        name: 'Department',
        description: user?.deptDescr || 'Loading...',
      },
      {
        name: 'Job Title',
        description: user?.jobTitle || 'Loading...',
      },
      {
        name: 'E-mail',
        description: user?.email || 'Loading...',
      },
      {
        name: 'Phone',
        description: user?.phone || 'Loading...',
      },
      {
        name: 'Office',
        description: user?.office || 'Loading...',
      },
    ],
    [
      user?.chName,
      user?.enName,
      user?.name,
      user?.emplId,
      user?.deptDescr,
      user?.jobTitle,
      user?.email,
      user?.phone,
      user?.office,
    ]
  );

  return (
    <header className='justify-between'>
      <nav
        aria-label='Global'
        className='mx-auto flex items-center justify-between p-6 lg:px-8'
      >
        <div className='flex lg:flex-1'>
          <a href='/dashboard' className='-m-1.5 p-1.5'>
            <span className='sr-only'>Your Company</span>
            <img
              alt=''
              src='/src/images/svg/ENBG_logo.svg'
              className='h-10 w-auto'
            />
          </a>
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
          >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon aria-hidden='true' className='size-6' />
          </button>
        </div>
        <PopoverGroup className='hidden lg:flex lg:gap-x-12 z-50'>
          <Popover className='relative'>
            <PopoverButton className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
              Cryptocurrencies
              <ChevronDownIcon
                aria-hidden='true'
                className='size-5 flex-none text-gray-400'
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className='absolute top-full left-1/2 transform -translate-x-1/2 z-10 mt-3 w-screen max-w-xs overflow-hidden rounded-2xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in'
            >
              <div className='p-2'>
                {Cryptocurrencies.map(item => (
                  <div
                    key={item.name}
                    className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                  >
                    <div className='flex-auto'>
                      <a
                        href={item.href}
                        className='block font-semibold text-gray-900'
                      >
                        {item.name}
                        <span className='absolute inset-0' />
                      </a>
                      <p className='mt-1 text-gray-600'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Popover className='relative'>
            <PopoverButton className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
              Exchanges
              <ChevronDownIcon
                aria-hidden='true'
                className='size-5 flex-none text-gray-400'
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className='absolute top-full left-1/2 transform -translate-x-1/2 z-10 mt-3 w-screen max-w-xs overflow-hidden rounded-2xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in'
            >
              <div className='p-2'>
                {Exchanges.map(item => (
                  <div
                    key={item.name}
                    className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                  >
                    <div className='flex-auto'>
                      <a
                        href={item.href}
                        className='block font-semibold text-gray-900'
                      >
                        {item.name}
                        <span className='absolute inset-0' />
                      </a>
                      <p className='mt-1 text-gray-600'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Popover className='relative'>
            <PopoverButton className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
              NFT
              <ChevronDownIcon
                aria-hidden='true'
                className='size-5 flex-none text-gray-400'
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className='absolute top-full left-1/2 transform -translate-x-1/2 z-10 mt-3 w-screen max-w-xs overflow-hidden rounded-2xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in'
            >
              <div className='p-2'>
                {NFT.map(item => (
                  <div
                    key={item.name}
                    className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                  >
                    <div className='flex-auto'>
                      <a
                        href={item.href}
                        className='block font-semibold text-gray-900'
                      >
                        {item.name}
                        <span className='absolute inset-0' />
                      </a>
                      <p className='mt-1 text-gray-600'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Popover className='relative'>
            <PopoverButton className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
              Learn
              <ChevronDownIcon
                aria-hidden='true'
                className='size-5 flex-none text-gray-400'
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className='absolute top-full left-1/2 transform -translate-x-1/2 z-10 mt-3 w-screen max-w-xs overflow-hidden rounded-2xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in'
            >
              <div className='p-2'>
                {Learn.map(item => (
                  <div
                    key={item.name}
                    className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                  >
                    <div className='flex-auto'>
                      <a
                        href={item.href}
                        className='block font-semibold text-gray-900'
                      >
                        {item.name}
                        <span className='absolute inset-0' />
                      </a>
                      <p className='mt-1 text-gray-600'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Popover className='relative'>
            <PopoverButton className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
              API
              <ChevronDownIcon
                aria-hidden='true'
                className='size-5 flex-none text-gray-400'
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className='absolute top-full left-1/2 transform -translate-x-1/2 z-10 mt-3 w-screen max-w-xs overflow-hidden rounded-2xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in'
            >
              <div className='p-2'>
                {Learn.filter(item => item.name === 'API').map(item => (
                  <div
                    key={item.name}
                    className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                  >
                    <div className='flex-auto'>
                      <a
                        href={item.href}
                        className='block font-semibold text-gray-900'
                      >
                        {item.name}
                        <span className='absolute inset-0' />
                      </a>
                      <p className='mt-1 text-gray-600'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </PopoverGroup>

        <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
          <Popover className='relative'>
            <PopoverButton className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
              <div className='relative'>
                <span className='absolute -inset-1.5' />
                <span className='sr-only'>Open user menu</span>
              </div>
              {isLoading
                ? 'Loading...'
                : user?.chName || user?.enName || user?.name || 'Johnny Yeh'}
              <ChevronDownIcon
                aria-hidden='true'
                className='size-5 flex-none text-gray-400'
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className='absolute top-full -right-px z-10 mt-3 w-screen max-w-64 overflow-hidden rounded-2xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in'
            >
              <div className='p-4'>
                {employee.map(item => (
                  <div
                    key={item.name}
                    className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                  >
                    <div className='flex-auto'>
                      <a
                        href={item.href}
                        className='block font-semibold text-gray-900'
                      >
                        {item.name}
                        <span className='absolute inset-0' />
                      </a>
                      <p className='mt-1 text-gray-600'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50'>
                <button
                  type='button'
                  onClick={handleLogout}
                  className='flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100'
                >
                  <ArrowLeftOnRectangleIcon
                    aria-hidden='true'
                    className='size-5 flex-none text-gray-400'
                  />
                  Log out
                </button>
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      </nav>

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className='lg:hidden'
      >
        <div className='fixed inset-0 z-10' />
        <DialogPanel className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <a href='#' className='-m-1.5 p-1.5'>
              <span className='sr-only text-gray-900'>ENBG</span>
              <img
                alt=''
                src='/src/images/svg/ENBG_logo.svg'
                className='h-10 w-auto'
              />
            </a>
            <button
              type='button'
              onClick={() => setMobileMenuOpen(false)}
              className='-m-2.5 rounded-md p-2.5 text-gray-700'
            >
              <span className='sr-only'>Close menu</span>
              <XMarkIcon aria-hidden='true' className='size-6' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                <Disclosure as='div' className='-mx-3'>
                  {({ open }) => (
                    <>
                      <DisclosureButton className='group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
                        Cryptocurrencies
                        <ChevronDownIcon
                          aria-hidden='true'
                          className={`size-5 flex-none transform ${open ? 'rotate-180' : ''}`}
                        />
                      </DisclosureButton>

                      <DisclosurePanel className='px-4 py-2'>
                        {Cryptocurrencies.map(item => (
                          <div
                            key={item.name}
                            className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                          >
                            <div className='flex-auto'>
                              <a
                                href={item.href}
                                className='block font-semibold text-gray-900'
                              >
                                {item.name}
                                <span className='absolute inset-0' />
                              </a>
                              <p className='mt-1 text-gray-600'>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as='div' className='-mx-3'>
                  {({ open }) => (
                    <>
                      <DisclosureButton className='group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
                        Exchanges
                        <ChevronDownIcon
                          aria-hidden='true'
                          className={`size-5 flex-none transform ${open ? 'rotate-180' : ''}`}
                        />
                      </DisclosureButton>

                      <DisclosurePanel className='px-4 py-2'>
                        {Exchanges.map(item => (
                          <div
                            key={item.name}
                            className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                          >
                            <div className='flex-auto'>
                              <a
                                href={item.href}
                                className='block font-semibold text-gray-900'
                              >
                                {item.name}
                                <span className='absolute inset-0' />
                              </a>
                              <p className='mt-1 text-gray-600'>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as='div' className='-mx-3'>
                  {({ open }) => (
                    <>
                      <DisclosureButton className='group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
                        NFT
                        <ChevronDownIcon
                          aria-hidden='true'
                          className={`size-5 flex-none transform ${open ? 'rotate-180' : ''}`}
                        />
                      </DisclosureButton>

                      <DisclosurePanel className='px-4 py-2'>
                        {NFT.map(item => (
                          <div
                            key={item.name}
                            className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                          >
                            <div className='flex-auto'>
                              <a
                                href={item.href}
                                className='block font-semibold text-gray-900'
                              >
                                {item.name}
                                <span className='absolute inset-0' />
                              </a>
                              <p className='mt-1 text-gray-600'>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as='div' className='-mx-3'>
                  {({ open }) => (
                    <>
                      <DisclosureButton className='group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
                        Learn
                        <ChevronDownIcon
                          aria-hidden='true'
                          className={`size-5 flex-none transform ${open ? 'rotate-180' : ''}`}
                        />
                      </DisclosureButton>

                      <DisclosurePanel className='px-4 py-2'>
                        {Learn.map(item => (
                          <div
                            key={item.name}
                            className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                          >
                            <div className='flex-auto'>
                              <a
                                href={item.href}
                                className='block font-semibold text-gray-900'
                              >
                                {item.name}
                                <span className='absolute inset-0' />
                              </a>
                              <p className='mt-1 text-gray-600'>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as='div' className='-mx-3'>
                  {({ open }) => (
                    <>
                      <DisclosureButton className='group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
                        API
                        <ChevronDownIcon
                          aria-hidden='true'
                          className={`size-5 flex-none transform ${open ? 'rotate-180' : ''}`}
                        />
                      </DisclosureButton>

                      <DisclosurePanel className='px-4 py-2'>
                        {Learn.filter(item => item.name === 'API').map(item => (
                          <div
                            key={item.name}
                            className='group relative flex items-center gap-x-6 rounded-lg p-2 text-sm/6 hover:bg-gray-50'
                          >
                            <div className='flex-auto'>
                              <a
                                href={item.href}
                                className='block font-semibold text-gray-900'
                              >
                                {item.name}
                                <span className='absolute inset-0' />
                              </a>
                              <p className='mt-1 text-gray-600'>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>
              <div className='py-6'>
                <button
                  type='button'
                  onClick={handleLogout}
                  className='-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 w-full text-left'
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
