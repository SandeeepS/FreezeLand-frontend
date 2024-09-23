
const  DataListing:React.FC = () => {
  return (

        <div className="xl:w-3/4 2xl:w-4/5 w-full">
          <div className="px-4 md:px-10 py-4 md:py-7">
            <div className="sm:flex items-center justify-between">
              <p
                tabIndex={0}
                className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800 dark:text-white"
              >
                {/* Files */}
              </p>
              <div className="mt-4 sm:mt-0">
                <button className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 inline-flex sm:ml-3 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
                  <p className="text-sm font-medium leading-none text-white">
                    Add New User
                  </p>
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 px-4 md:px-10 pb-5">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <tbody>
                  <tr
                    tabIndex={0}
                    className="focus:outline-none text-sm leading-none text-gray-600 dark:text-gray-200 h-16"
                  >
                    <td className="w-1/2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-700 rounded-sm flex items-center justify-center">
                          <p className="text-xs font-bold leading-3 text-white">FIG</p>
                        </div>
                        <div className="pl-2">
                          <p className="text-sm font-medium leading-none text-gray-800 dark:text-white">
                            Arjun
                          </p>
                          <p className="text-xs leading-3 text-gray-600 dark:text-gray-200 mt-2">
                            Kunnil
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="pl-16">
                      <p>Pathanamthitta</p>
                    </td>
                    <td>
                      <p className="pl-16">Active</p>
                    </td>
                  
                    <td>
                      <p className="pl-16">Edit</p>
                    </td>
                    <td>
                      <p className="pl-16">Block</p>
                    </td>
                  </tr>



                  <tr
                    tabIndex={0}
                    className="focus:outline-none text-sm leading-none text-gray-600 dark:text-gray-200 h-16"
                  >
                    <td className="w-1/2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-700 rounded-sm flex items-center justify-center">
                          <p className="text-xs font-bold leading-3 text-white">FIG</p>
                        </div>
                        <div className="pl-2">
                          <p className="text-sm font-medium leading-none text-gray-800 dark:text-white">
                            Sanush
                          </p>
                          <p className="text-xs leading-3 text-gray-600 dark:text-gray-200 mt-2">
                            KK
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="pl-16">
                      <p>Pathanamthitta</p>
                    </td>
                    <td>
                      <p className="pl-16">Active</p>
                    </td>
                  
                    <td>
                      <p className="pl-16">Edit</p>
                    </td>
                    <td>
                      <p className="pl-16">Block</p>
                    </td>
                  </tr>
    
                  {/* Repeat the structure for other rows */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

    
  )
}

export default DataListing
