import { Badge } from "./ui/badge";


const SectionHeader = ({
  badgeTxt,
  title,
  desc,
}: {
  badgeTxt: string;
  title: string;
  desc: string;
}) => {
  return (
    <div className="flex flex-col items-center text-center mb-8 md:mb-12 lg:mb-16">
      <Badge className="bg-blue-700 border-0 mb-3 md:mb-4 shadow-lg backdrop-blur-sm text-sm md:text-base">
        {badgeTxt}
      </Badge>
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
        {title}
      </h2>
      <p className="sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{desc}</p>
    </div>
  );
};

export default SectionHeader;
