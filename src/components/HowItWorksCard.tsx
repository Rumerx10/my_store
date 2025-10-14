import { ReactNode } from 'react';
import { Card, CardContent } from './ui/card';

const HowItWorksCard = ({
  color,
  icon,
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}) => {
  return (
    <Card className="border-2 h-full shadow-xl backdrop-blur-sm bg-white/40 border-gray-200 hover:shadow-xl transition-all duration-300 lg:hover:scale-105">
      <CardContent className="p-8 text-center">
        <div
          className={`bg-gradient-to-r ${color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}
        >
          {icon}
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-sm shadow-lg">
          {step}
        </div>
        <h3 className="font-semibold text-gray-900 mb-3 text-lg">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default HowItWorksCard;
