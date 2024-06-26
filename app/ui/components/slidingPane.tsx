import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";

type SlidingPaneProps = {
  children: ReactNode;
  handleClose: () => void;
  isOpen: boolean;
  title: string;
};

export const SlidingPane = ({
  children,
  handleClose,
  isOpen,
  title,
}: SlidingPaneProps) => (
  <Transition.Root show={isOpen} as={Fragment}>
    <Dialog className="relative z-10" onClose={handleClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-in-out duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in-out duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full md:pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="  rounded-xl overflow-hidden pointer-events-auto w-screen md:max-w-xl m-4 md:ml-0 md:mr-4 md:mt-4 md:mb-4   ">
                <div className="flex h-full flex-col overflow-auto bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className=" text-lg font-semibold leading-6 text-gray-900">
                        {title}
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="relative rounded-md border p-2 border-gray-200 bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={handleClose}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <Image
                            alt=""
                            src="/icons/close_ring_duotone-1.svg"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {children}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
);
