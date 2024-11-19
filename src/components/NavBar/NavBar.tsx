"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { NavBarButtonList } from "./NavBarButtonConfig";
import Button from "../Button/Button";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full py-6 bg-white flex-shrink-0 relative z-10">
      <div className="w-full px-4 flex items-center gap-6">
        {/* Left section with logo and buttons */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link href="/">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={30}
              height={30}
              priority
            />
          </Link>
          {NavBarButtonList.map((button) => (
            <Button
              key={button.path}
              btnName={button.name}
              path={button.path}
              active={pathname.startsWith(`${button.path}`)}
            />
          ))}
        </div>
        {/* Extended SearchBar */}
        <div className="relative w-[65vw]">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
