import React from 'react';
import SectionWrapper from '../common/SectionWrapper';
import Link from 'next/link';
import Button from '../common/Button';

const CampaignExpired = () => {
  return (
    <SectionWrapper className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="text-6xl mb-6">⏳</div>
      <h1 className="text-3xl md:text-5xl font-bold mb-4">This Campaign Has Ended</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Don't worry, there's always something new happening at Yeahlo. Explore our latest collections instead!
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </SectionWrapper>
  );
};

export default CampaignExpired;
