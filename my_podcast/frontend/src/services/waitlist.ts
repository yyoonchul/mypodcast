interface WaitlistSubmission {
  email: string;
  podcastType: 'news' | 'career';
  selectedTopics: string[];
  selectedJobRoles: string[];
  wantProPlan: boolean;
  createdAt: string;
}

export const submitWaitlistData = async (data: Omit<WaitlistSubmission, 'createdAt'>): Promise<void> => {
  try {
    const response = await fetch('/api/submit-waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit waitlist data');
    }
  } catch (error) {
    console.error('Error submitting waitlist data:', error);
    throw error;
  }
}; 