import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { DynamicForm } from './components/Form/DynamicForm';
import { MultiStepForm } from './components/Form/MultiStepForm';
import { SimpleSchemaEditor } from './components/SchemaEditor/SimpleSchemaEditor';
import { StepConfigEditor } from './components/SchemaEditor/StepConfigEditor';
import { defaultFormSchema } from './data/formSchema';
import { FormResponse, FormField, MultiStepFormConfig } from './types/form';
import { useSchemaStorage } from './hooks/useSchemaStorage';
import { createMultiStepConfig } from './utils/multiStepHelpers';

const App: React.FC = () => {
  const { schema, updateSchema } = useSchemaStorage();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormResponse | null>(null);
  const [showSchemaEditor, setShowSchemaEditor] = useState(false);
  const [showStepConfigEditor, setShowStepConfigEditor] = useState(false);
  const [isMultiStep, setIsMultiStep] = useState(false);
  const [multiStepConfig, setMultiStepConfig] = useState<MultiStepFormConfig>(() => createMultiStepConfig(schema, 3));

  const handleFormSubmit = async (data: FormResponse) => {
    console.log('Form submitted with data:', JSON.stringify(data, null, 2));
    setSubmittedData(data);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleSuccess = () => {
    console.log('Form submission successful!');
  };

  const handleError = (error: string) => {
    console.error('Form submission error:', error);
    alert(`Error: ${error}`);
  };


  const handleSchemaChange = (newSchema: FormField[]) => {
    updateSchema(newSchema);
    setShowSuccess(false);
    setSubmittedData(null);
    // Update multi-step config when schema changes
    setMultiStepConfig(createMultiStepConfig(newSchema, 3));
  };

  const handleStepConfigChange = (newConfig: MultiStepFormConfig) => {
    setMultiStepConfig(newConfig);
  };

  const openSchemaEditor = () => {
    setShowSchemaEditor(true);
  };

  const closeSchemaEditor = () => {
    setShowSchemaEditor(false);
  };

  const openStepConfigEditor = () => {
    setShowStepConfigEditor(true);
  };

  const closeStepConfigEditor = () => {
    setShowStepConfigEditor(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              KYC Form
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={openSchemaEditor}
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Schema
              </button>
              <button
                onClick={() => setIsMultiStep(!isMultiStep)}
                className={`${isMultiStep ? 'btn-primary' : 'btn-secondary'}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                {isMultiStep ? 'Single Step' : 'Multi Step'}
              </button>
              {isMultiStep && (
                <button
                  onClick={openStepConfigEditor}
                  className="btn-secondary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configure Steps
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Please fill out the form below with your information. All required fields are marked with an asterisk (*).
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-success-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-success-800 dark:text-success-200">
                  Form submitted successfully!
                </h3>
                <div className="mt-2 text-sm text-success-700 dark:text-success-300">
                  <p>Your information has been received. Check the console for the submitted data.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isMultiStep ? (
          <MultiStepForm
            config={multiStepConfig}
            onSubmit={handleFormSubmit}
            onSuccess={handleSuccess}
            onError={handleError}
            persistData={true}
          />
        ) : (
          <DynamicForm
            fields={schema}
            onSubmit={handleFormSubmit}
            onSuccess={handleSuccess}
            onError={handleError}
            persistData={true}
          />
        )}

        {submittedData && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Last Submitted Data:
            </h3>
            <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </main>

      <SimpleSchemaEditor
        isOpen={showSchemaEditor}
        onClose={closeSchemaEditor}
        onSchemaChange={handleSchemaChange}
        currentSchema={schema}
      />

      <StepConfigEditor
        isOpen={showStepConfigEditor}
        onClose={closeStepConfigEditor}
        fields={schema}
        onConfigChange={handleStepConfigChange}
      />
    </div>
  );
};

export default App;
