import { Button } from './ui/button';
import { Input } from './ui/input';

const PhoneModal = ({
  setShowPhoneModal,
  phoneNumber,
  setPhoneNumber,
  selectedProvider,
  handlePhoneSubmit,
}: {
  setShowPhoneModal: (value: boolean) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  selectedProvider: string;
  handlePhoneSubmit: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-2xl lg:min-w-md w-full p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Enter Phone Number</h3>
      <p className="text-sm text-gray-600 mb-4">
        Enter your {selectedProvider} registered phone number
      </p>
      <Input
        type="tel"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />
      <div className="flex gap-3">
        <Button
          onClick={() => {
            setShowPhoneModal(false);
            setPhoneNumber('');
          }}
          className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold py-2 rounded"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePhoneSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PhoneModal;
