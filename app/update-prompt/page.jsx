'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const EditPromptForm = dynamic(() => import('@components/update-prompt/EditPromptForm'), {
    suspense: true,
  });
  
const EditPrompt = () => {
return (
    <Suspense fallback={<div>Loading...</div>}>
    <EditPromptForm />
    </Suspense>
);
};

export default EditPrompt