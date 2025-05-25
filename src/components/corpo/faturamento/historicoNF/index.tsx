import React, { useState } from 'react';
import TabelaFaturamento from './table/tableTeste';
import { LiaSearchSolid } from 'react-icons/lia';
import useFocusProd from './useFocus/vendaPesquisa';

export default function PageSidebar() {
  const [pesquisa] = React.useState('');
  const [focado, setFocado] = useState(false);
  const prodInputRef = useFocusProd<HTMLInputElement>();
  return (
    <div className="h-full flex w-full flex-col bg-muted/40 text-black dark:text-gray-50">
      {/* inicio da tela desktop */}

      <div className="  border-b border-l border-r border-gray-300 h-full w-[100%] ">
        <div className=" w-[100%] h-full flex-col flex justify-center items-center border-t border-gray-300 dark:bg-black bg-white">
          <div className="w-full pl-8 pr-8 pb-3 pt-4 flex items-center justify-center  bg-gray-100  dark:bg-gray-800">
            <div className="relative h-10 w-full  min-w-[200px]">
              <div className="absolute top-2/4 right-3 grid h-5 w-5 -translate-y-2/4 place-items-center text-gray-50">
                <LiaSearchSolid
                  size={20}
                  className={`${
                    focado
                      ? 'text-blue-500 dark:text-blue-200'
                      : 'text-gray-300 dark:text-gray-500'
                  } `}
                />
              </div>
              <input
                className="peer h-full w-full rounded-[7px] 
                                   border border-gray-300 dark:border-gray-400
                                    dark:focus:border-blue-300
                                    dark:focus:border-t-transparent
                                    bg-transparent px-3 py-2.5 !pr-9 
                                    font-sans  font-normal 
                                    text-gray-400
                                    focus:text-blue-600  
                                    dark:text-gray-600 
                                    dark:focus:text-blue-200 outline outline-0 
                                    transition-all   focus:border-2 
                                    focus:border-blue-300 focus:border-t-transparent
                                    dark:border-t-transparent 
                                    
                                    border-t-transparent focus:outline-0 
                                    placeholder-shown:border-t  
                                    dark:placeholder-shown:border-gray-400
                                    placeholder-shonw:border-gray-400
                                    placeholder-shown:border-gray-300
                                    placeholder-shown:placeholder-gray-400 
                                    dark:placeholder-shown:placeholder-gray-500
                                     disabled:border-0 disabled:bg-gray-50"
                ref={prodInputRef}
                value={pesquisa || ''}
                onFocus={() => setFocado(true)}
                onBlur={() => setFocado(false)}
              />
              <label
                className="text-gray-400 
                                   before:content[' '] after:content[' '] 
                                 pointer-events-none absolute left-0 -top-1.5 
                                 flex h-full w-full select-none text-[11px] font-normal 
                                 leading-tight  transition-all 
                                 before:pointer-events-none before:mt-[6.5px] 
                                 before:mr-1 before:box-border before:block 
                                 before:h-1.5 before:w-2.5 before:rounded-tl-md
                                 before:border-t before:border-l 
                                 before:border-gray-300 before:transition-all 
                                 after:pointer-events-none after:mt-[6.5px] 
                                 after:ml-1 after:box-border after:block 
                                 after:h-1.5 after:w-2.5 after:flex-grow 
                                 after:rounded-tr-md after:border-t after:border-r 
                                 after:border-gray-300 after:transition-all 
                                 dark:after:border-gray-500
                                 peer-focus:after:border-t-2
                                 peer-placeholder-shown: 
                                 peer-placeholder-shown:leading-[3.75] 
                                 peer-placeholder-shown:text-gray-400
                                 dark:peer-placeholder-shown:text-gray-500 
                                 peer-placeholder-shown:before:border-transparent 
                                 peer-placeholder-shown:after:border-transparent 
                                 peer-focus:text-[11px] peer-focus:leading-tight 
                                 peer-focus:text-blue-500
                                 dark:peer-focus:text-blue-200
                                 peer-focus:before:border-t-1 
                                 peer-focus:before:border-l-2 
                                 peer-focus:before:border-blue-300 
                                 peer-focus:after:border-t-1 
                                 peer-focus:after:border-r-2
                                 peer-focus:after:border-blue-300 
                                 peer-disabled:text-transparent 
                                 peer-disabled:before:border-transparent 
                                 peer-disabled:after:border-transparent "
              >
                Consultar Fatura
              </label>
            </div>
          </div>

          <TabelaFaturamento />

          <div className="h-screen w-[100%] text-black dark:text-gray-50 flex justify-center items-center border-t border-gray-300 dark:bg-gray-900 bg-white">
            FATURAR
          </div>
        </div>
      </div>
    </div>
  );
}
