'use client';
import RecordedfileItemCard from '@/components/pages/dashboard/RecordedfileItemCard';
import { api } from '@/convex/_generated/api';
// import { Id } from '@/convex/_generated/dataModel';
import { SearchResult } from '@/convex/openai';
import { useUser } from '@clerk/clerk-react';
import { useQuery, useAction } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// TODO: Add correct types on frontend like "Id"

const DashboardHomePage = () => {
  const { user } = useUser();
  const id = user?.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [relevantNotes, setRelevantNotes] = useState<SearchResult[]>();

  const allNotes = useQuery(api.notes.getNotes, { userId: id });
  const performMyAction = useAction(api.openai.similarNotes);

  const handleSearch = async (e: any) => {
    e.preventDefault();

    console.log({ searchQuery });

    const results = await performMyAction({ searchQuery: searchQuery });
    console.log({ results });
    setRelevantNotes(results);
  };

  const finalNotes = relevantNotes ?? allNotes;

  return (
    <div className="mt-5 min-h-[100vh] w-full">
      <div className=" w-full py-[23px] md:py-4 lg:py-[25px]">
        <h1 className="text-center text-2xl font-medium text-dark md:text-4xl">
          Your Voice Notes
        </h1>
      </div>
      {/* search bar */}
      <div className="mx-auto mb-10 mt-4 flex h-fit w-[90%] items-center gap-[17px] rounded border border-black bg-white px-[11px] py-[10px] sm:px-[15px] md:mb-[42px] md:w-[623px] md:px-[40px] md:py-[10px]">
        <Image
          src="/icons/search.svg"
          width={27}
          height={26}
          alt="search"
          className="h-5 w-5 md:h-6 md:w-6"
        />
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="w-full text-[16px] outline-none md:text-xl"
          />
        </form>
      </div>
      {/* recorded items */}
      <div className="h-fit w-full max-w-[1360px] md:px-5 xl:mx-auto">
        {finalNotes &&
          finalNotes.map((item, index) => (
            <RecordedfileItemCard {...item} key={index} />
          ))}
        {!allNotes && (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <p className="text-center text-2xl text-dark">
              You currently have no <br /> recordings.
            </p>
          </div>
        )}
      </div>
      {/* actions button container */}
      <div className="mx-auto mt-[40px] flex h-fit w-full flex-col items-center px-5 pb-10 md:mt-[50px] lg:pb-5">
        <div className="mt-10 flex flex-col gap-6 md:flex-row">
          <Link
            className="rounded-[7px] bg-dark px-[37px] py-[15px] text-[17px] leading-[79%] tracking-[-0.75px] text-light md:text-2xl"
            style={{ boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
            href="/record"
          >
            Record a New Voice Note
          </Link>
          {allNotes && (
            <Link
              className="rounded-[7px] px-[37px] py-[15px] text-[17px] leading-[79%] tracking-[-0.75px] md:text-2xl"
              style={{ boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
              href="/dashboard/action-items"
            >
              View Action Items
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
