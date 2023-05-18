import React from 'react';

const Chat = () => {
  return (
    <div className="flex flex-col gap-x-4 h-full w-full p-4 justify-end">
      <div className="overflow-y-auto flex py-2 flex-col-reverse">
        {true &&
          [...Array(20)].map((suggestion, index) => {
            return (
              <div key={index} className="py-2 px-1">
                <div className="text-gray-600 text-sm">SENT BY SOMEONE</div>
                <div className="text-md font-light font-Rubik">
                  HELLO WORLD {index}
                </div>
              </div>
            );
          })}
      </div>
      <div>
        <form className="flex gap-x-4 justify-center mt-4 items-center">
          <div className="w-full">
            <input
              type="text"
              id="text"
              name="text"
              value="HELLO WORLD"
              placeholder="Send Message"
              autoComplete="off"
              className="w-full bg-white bg-opacity-50 rounded border border-gray-100 focus:border-rose-700 focus:ring-2 focus:ring-rose-200 text-base outline-none text-gray-700 py-1 px-3 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            type="button"
            class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm text-center px-6 py-2"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
