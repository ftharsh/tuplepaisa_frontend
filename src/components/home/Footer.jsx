import React from "react";
import Fwave from "../../media/images/wave2.png";
import Dwave from "../../media/images/wavedown.png";
import Rlogo1 from "../../media/images/reviewlogo1.png";
import Rlogo2 from "../../media/images/reviewlogo2.png";
import Rlogo3 from "../../media/images/reviewlogo3.png";
import Rlogo4 from "../../media/images/reviewlogo4.png";

import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const Footer = () => {
  // return (
  //   <footer className="relative w-full pt-11 bg-blue-700">
  //     <div className="top-0 left-0 right-0 ">
  //       <div className="rotate-180">
  //         <img src={Fwave} alt="Wave Pattern" className="w-full h-[10rem]" />
  //       </div>
  //       <div className="h-[15rem] w-full bg-[#5271ff] flex">
  //         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
  //           <div className=" p-4   text-center">
  //             <img src={Rlogo1} alt="Bloomberg logo" />
  //             <div className="flex items-center justify-center">
  //               <FormatQuoteIcon className="rotate-180 text-white " />
  //               <p className="text-xl text-white font-serif pt-6 font-semibold">
  //                 The Next-gen platform
  //               </p>
  //               <FormatQuoteIcon className="text-white" />
  //             </div>
  //           </div>
  //           <div className=" p-4  text-center">
  //             <img src={Rlogo2} alt="Bloomberg logo" />
  //             <div className="flex items-center justify-center">
  //               <FormatQuoteIcon className="rotate-180 text-white " />
  //               <p className="text-xl text-white font-serif pt-6 font-semibold">
  //                 A young and hip transformation
  //               </p>
  //               <FormatQuoteIcon className="text-white" />
  //             </div>
  //           </div>
  //           <div className=" p-4  text-center">
  //             <img src={Rlogo3} alt="Bloomberg logo" />
  //             <div className="flex items-center justify-center">
  //               <FormatQuoteIcon className="rotate-180 text-white " />
  //               <p className="text-xl text-white font-serif pt-6 font-semibold">
  //                 Fresh and bold
  //               </p>
  //               <FormatQuoteIcon className="text-white" />
  //             </div>
  //           </div>
  //           <div className=" p-4  text-center">
  //             <img src={Rlogo4} alt="Bloomberg logo" />
  //             <div className="flex items-center justify-center">
  //               <FormatQuoteIcon className="rotate-180 text-white " />
  //               <p className="text-xl text-white font-semibold font-serif pt-6 ">
  //                 Seamlessly modern
  //               </p>
  //               <FormatQuoteIcon className="text-white" />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <img
  //         src={Dwave}
  //         alt="Wave Pattern"
  //         className="w-full h-[10rem] transform scaleX(-1)"
  //       />
  //     </div>
  //     <div className="w-full text-white pt-11 bg-black h-[40rem]">
  //       <div className="max-w-6xl mx-auto">
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  //           {/* Brand Section */}
  //           <div>
  //             <h2 className="text-6xl font-bold mb-4">
  //               This wallet is for
  //               <br />
  //               the main characters of their
  //               <br />
  //               money story®
  //             </h2>
  //           </div>

  //           <div>
  //             <h3 className="font-bold mb-2 underline">Contact Us</h3>
  //             <a
  //               href="mailto:hariharshvardhan22@tuplepaisa.com"
  //               className="block text-sm hover:underline mb-1"
  //             >
  //               harsh@tuplepaisa.com
  //             </a>
  //             <p className="text-sm mb-1">+91 20 798XXXXX</p>
  //             <p className="text-sm mb-1">Mythic Centre,</p>
  //             <p className="text-sm mb-4">70 Wapping Wall, India - 560068</p>
  //             <a href="/" className="text-sm hover:underline">
  //               SEE ON MAP →
  //             </a>
  //           </div>

  //           <div>
  //             <h3 className="font-bold mb-2 underline">About Us</h3>

  //             <p className="text-lg mb-1">
  //               We're not your parents' finance app. who've survived on instant
  //               noodles, for a generation that wants more than just surviving.
  //               We're here to help you level up your money game, no cap.
  //             </p>
  //             {/*istanbul ignore file*/}
  //             <p className="text-lg mb-1">
  //               We're the wallet that gets it – the side hustles, the crypto
  //             </p>
  //             <p className="text-lg mb-4">
  //               dreams, and yes, the impulse purchases at 3 AM. Built by people
  //             </p>
  //             <p className="text-lg mb-4">
  //               more than just surviving. We're here to help you level up your
  //               money game, no cap
  //             </p>
  //             <a href="/" className="text-sm hover:underline">
  //               READ MORE →
  //             </a>
  //           </div>
  //         </div>

  //         <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center">
  //           <div>
  //             <h4 className="text-sm mb-2">
  //               WANT TO BE THE SMARTEST
  //               <br />
  //               IN YOUR OFFICE?
  //             </h4>
  //             <a href="/" className="text-sm hover:underline">
  //               SIGN UP FOR OUR NEWSLETTER →
  //             </a>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </footer>
  // );
  return (
    <footer className="relative w-full pt-11 bg-blue-700">
      <div className="top-0 left-0 right-0">
        <div className="rotate-180">
          <img src={Fwave} alt="Wave Pattern" className="w-full h-40" />
        </div>
        <div className="h-auto w-full bg-[#5271ff] flex flex-wrap justify-center py-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[Rlogo1, Rlogo2, Rlogo3, Rlogo4].map((logo, index) => (
              <div key={index} className="p-4">
                <img src={logo} alt="Review logo" className="mx-auto" />
                <div className="flex items-center justify-center mt-4">
                  <FormatQuoteIcon className="rotate-180 text-white" />
                  <p className="text-lg sm:text-xl text-white font-serif font-semibold px-2">
                    {
                      [
                        "The Next-gen platform",
                        "A young and hip transformation",
                        "Fresh and bold",
                        "Seamlessly modern",
                      ][index]
                    }
                  </p>
                  <FormatQuoteIcon className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <img
          src={Dwave}
          alt="Wave Pattern"
          className="w-full h-40 scale-x-[-1]"
        />
      </div>
      <div className="w-full text-white pt-11 bg-black py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              This wallet is for the main characters of their money story®
            </h2>
          </div>
          <div>
            <h3 className="font-bold mb-2 underline">Contact Us</h3>
            <a
              href="mailto:hariharshvardhan22@tuplepaisa.com"
              className="block text-sm hover:underline mb-1"
            >
              harsh@tuplepaisa.com
            </a>
            <p className="text-sm mb-1">+91 20 798XXXXX</p>
            <p className="text-sm mb-1">Mythic Centre,</p>
            <p className="text-sm mb-4">70 Wapping Wall, India - 560068</p>
            <a href="/" className="text-sm hover:underline">
              SEE ON MAP →
            </a>
          </div>
          <div>
            <h3 className="font-bold mb-2 underline">About Us</h3>
            <p className="text-lg mb-4">
              We're not your parents' finance app. Built by people who've
              survived on instant noodles, for a generation that wants more than
              just surviving. We're here to help you level up your money game.
            </p>
            <a href="/" className="text-sm hover:underline">
              READ MORE →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
