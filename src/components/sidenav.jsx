import React from 'react';

const Sidenav = () => {
  return (
    <>
      <div
        className="
      flex flex-col
      w-64
      h-full
      overflow-hidden
     "
      >
        <div className="flex flex-col px-2 flex-1 py-3 h-5/6 sidenav overflow-y-scroll">
          <div className="text-sm text-gray-400 font-Rubik font-semibold uppercase">
            Creator - 1
          </div>
          <div className="text-white py-2 flex gap-x-4 items-center">
            <div className="rounded-full h-10 w-10 overflow-hidden object-contain">
              <img
                className="h-full w-full object-cover"
                height={500}
                width={500}
                src={`https://avatars.dicebear.com/api/initials/hell.svg`}
              />
            </div>
            <div className="flex flex-col text-sm font-Rubik font-semibold justify-center items-start">
              <div>CREATOR</div>
              <div className="text-gray-400 text-xs">ROLL NO</div>
            </div>
          </div>

          {true ? (
            <>
              <div className="text-sm text-gray-400 font-Rubik font-semibold uppercase mt-4">
                Managers - HELLO WORLD
              </div>
              {[...Array(10)].map((banda, key) => {
                return (
                  <div
                    className="text-white py-2 flex gap-x-4 items-center"
                    key={key}
                  >
                    <div className="rounded-full h-10 w-10 overflow-hidden object-contain">
                      <img
                        className="h-full w-full object-cover"
                        height={500}
                        width={500}
                        src={`https://avatars.dicebear.com/api/initials/hello.svg`}
                      />
                    </div>
                    <div className="flex flex-col text-sm font-Rubik font-semibold justify-center items-start">
                      <div>HELLO WORLD</div>
                      <div className="text-gray-400 text-xs">HELLO WORLD</div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}
          {true && (
            <>
              <div className="text-sm text-gray-400 font-Rubik font-semibold uppercase mt-4">
                Members - 2
              </div>
              {[...Array(10)].map((banda, key) => {
                return (
                  <div
                    className="text-white py-2 flex gap-x-4 items-center"
                    key={key}
                  >
                    <div className="rounded-full h-10 w-10 overflow-hidden object-contain">
                      <img
                        className="h-full w-full object-cover"
                        height={500}
                        width={500}
                        src={`https://avatars.dicebear.com/api/initials/Hello.svg`}
                      />
                    </div>
                    <div className="flex flex-col text-sm font-Rubik font-semibold justify-center items-start">
                      <div>HELLO WORLD</div>
                      <div className="text-gray-400 text-xs">HELLO WORLD</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidenav;
