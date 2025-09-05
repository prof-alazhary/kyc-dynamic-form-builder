import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { DynamicForm } from './components/Form/DynamicForm';
import { SimpleSchemaEditor } from './components/SchemaEditor/SimpleSchemaEditor';
import { sampleFormSchema, extendedFormSchema } from './data/formSchema';
import { FormResponse, FormField } from './types/form';
import { useSchemaStorage } from './hooks/useSchemaStorage';

const App: React.FC = () => {
  const { schema, updateSchema } = useSchemaStorage();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormResponse | null>(null);
  const [showSchemaEditor, setShowSchemaEditor] = useState(false);

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

  const switchSchema = () => {
    const isCurrentlyBasic = JSON.stringify(schema) === JSON.stringify(sampleFormSchema);
    updateSchema(isCurrentlyBasic ? extendedFormSchema : sampleFormSchema);
  };

  const handleSchemaChange = (newSchema: FormField[]) => {
    updateSchema(newSchema);
    setShowSuccess(false);
    setSubmittedData(null);
  };

  const openSchemaEditor = () => {
    setShowSchemaEditor(true);
  };

  const closeSchemaEditor = () => {
    setShowSchemaEditor(false);
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
                onClick={switchSchema}
                className="btn-secondary"
              >
                Switch to {JSON.stringify(schema) === JSON.stringify(sampleFormSchema) ? 'Extended' : 'Basic'} Form
              </button>
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

        <DynamicForm
          fields={schema}
          onSubmit={handleFormSubmit}
          onSuccess={handleSuccess}
          onError={handleError}
          persistData={true}
        />

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
    </div>
  );
};

export default App;
