function CardLists({ news }) {
  return (
    <div className="CardLists_Area">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {news.map((data) => (
            <div key={data.ID} className="group relative">
              <img
                alt={data.TITLE}
                src={data.IMAGE_URL}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <p className="mb-1 font-bold text-gray-900 dark:text-moon-50 text-lg md:text-xl leading-7">
                    {data.SOURCE_DATA.NAME}
                  </p>
                  <h3 className="text-sm text-gray-700">
                    <a href={data.GUID} target="_blank" rel="noopener noreferrer">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {data.TITLE}
                    </a>
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardLists;