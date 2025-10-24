import { useState, useCallback } from 'react';
import { createDilemma } from '../store/dilemmasSlice.js';
import { useAsyncAction } from '../hooks/useStore.js';
import { useLoading } from '../contexts/LoadingContext.jsx';
import DilemmaOption from '../components/DilemmaOption.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Panel from '../components/ui/Panel.jsx';
import Button from '../components/ui/Button.jsx';

const MAX_TEXT_LENGTH = 200;

const Post = () => {
  const [optionA, setOptionA] = useState({ text: '', file: null, previewUrl: '' });
  const [optionB, setOptionB] = useState({ text: '', file: null, previewUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const { execute, isLoading } = useAsyncAction('createDilemma');
  const loading = useLoading('createDilemma'); // For multi-stage message updates
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (submitting || isLoading) return;
    if (optionA.text.length > MAX_TEXT_LENGTH || optionB.text.length > MAX_TEXT_LENGTH) {
      toast.error(`Text must be ${MAX_TEXT_LENGTH} characters or less`);
      return;
    }
    try {
      setSubmitting(true);
      loading.start('Uploading images...');
      
      // Upload images first
      let imageUrlA = '';
      let imageUrlB = '';
      if (optionA.file) {
        const fd = new FormData();
        fd.append('image', optionA.file);
        const resA = await fetch('/api/dilemmas/upload', { method: 'POST', body: fd, credentials: 'include' });
        const dataA = await resA.json();
        if (!resA.ok) throw new Error(dataA.error || 'Upload failed');
        imageUrlA = dataA.url;
      }
      if (optionB.file) {
        const fd = new FormData();
        fd.append('image', optionB.file);
        const resB = await fetch('/api/dilemmas/upload', { method: 'POST', body: fd, credentials: 'include' });
        const dataB = await resB.json();
        if (!resB.ok) throw new Error(dataB.error || 'Upload failed');
        imageUrlB = dataB.url;
      }

      // Create dilemma
      loading.updateMessage('Creating dilemma...');
      await execute(createDilemma({
        optionA: optionA.text,
        optionB: optionB.text,
        imageUrlA,
        imageUrlB
      }));
      loading.stop();
      navigate('/feed');
    } catch {
      loading.stop();
    } finally {
      setSubmitting(false);
    }
  }, [submitting, isLoading, optionA, optionB, execute, loading, navigate]);

  const handleOptionAChange = useCallback((val) => {
    setOptionA(val);
  }, []);

  const handleOptionBChange = useCallback((val) => {
    setOptionB(val);
  }, []);

  const handleOptionAImageUpload = useCallback((file) => {
    const previewUrl = URL.createObjectURL(file);
    setOptionA((prev) => ({ ...prev, file, previewUrl }));
  }, []);

  const handleOptionBImageUpload = useCallback((file) => {
    const previewUrl = URL.createObjectURL(file);
    setOptionB((prev) => ({ ...prev, file, previewUrl }));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">\n        
        <div className="text-center">
          <h2 className="heading">Create Dilemma</h2>
          <div className="heading-rule"></div>
        </div>

        <Panel className="w-full ">
          <form id="create-dilemma-form" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <DilemmaOption
                label="Option A"
                value={optionA}
                onChange={handleOptionAChange}
                disabled={submitting || isLoading}
                onImageUpload={handleOptionAImageUpload}
              />

              <DilemmaOption
                label="Option B"
                value={optionB}
                onChange={handleOptionBChange}
                disabled={submitting || isLoading}
                onImageUpload={handleOptionBImageUpload}
              />
            </div>

          </form>
        </Panel>

        <div className="mt-6">
          <Button 
            form="create-dilemma-form" 
            type="submit" 
            loading={submitting || isLoading}
            disabled={submitting || isLoading} 
            variant="primary" 
            className="w-full py-5 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting || isLoading ? loading.message || 'Posting...' : 'Post Dilemma'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Post;