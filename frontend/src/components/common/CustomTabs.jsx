import React from 'react';

function CustomTabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <div className='flex flex-col sm:flex-row border-b border-gray-200 bg-white rounded-t-lg shadow-sm'>
        <div className='flex w-full'>
          {tabs.map((tab, index) => (
            <button
              type='button'
              key={index}
              onClick={() => onChange(index)}
              className={`
                relative flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 
                font-medium text-sm transition-all duration-300 ease-in-out transform
                ${index === 0 ? 'rounded-tl-lg' : ''}
                ${index === tabs.length - 1 ? 'rounded-tr-lg' : ''}
                ${
                  activeTab === index
                    ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-inner scale-105 sm:scale-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:scale-105 sm:hover:scale-100'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
              role='tab'
              aria-selected={activeTab === index}
              aria-controls={`tabpanel-${index}`}
              id={`tab-${index}`}
            >
              <div className='relative flex items-center'>
                <div
                  className={`transition-transform duration-200 ${activeTab === index ? 'scale-110' : ''}`}
                >
                  {tab.icon}
                </div>
                {tab.badge && tab.badge > 0 ? (
                  <span
                    className='absolute -top-2 -right-2 bg-gradient-to-r 
                  from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 
                  flex items-center justify-center min-w-[20px] font-bold shadow-lg 
                  animate-badge-pulse'
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              <span className='whitespace-nowrap hidden sm:inline'>
                {tab.label}
              </span>
              <span className='whitespace-nowrap text-xs sm:hidden'>
                {tab.label}
              </span>

              <div
                className={`
                absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-in-out
                ${activeTab === index ? 'w-12 sm:w-16 opacity-100' : 'w-0 opacity-0'}
              `}
              />

              {activeTab === index && (
                <div className='absolute inset-0 bg-blue-100 opacity-20 rounded-lg blur-sm -z-10' />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className='bg-white rounded-b-lg'>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`
              p-4 sm:p-6 transition-all duration-300 ease-in-out
              ${
                activeTab === index
                  ? 'block opacity-100 transform translate-y-0'
                  : 'hidden opacity-0 transform translate-y-2'
              }
            `}
            role='tabpanel'
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            tabIndex={activeTab === index ? 0 : -1}
          >
            {activeTab === index && (
              <div className='animate-fadeIn'>{tab.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(CustomTabs);
