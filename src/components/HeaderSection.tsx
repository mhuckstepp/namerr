import { Heart } from "lucide-react";

export default function HeaderSection() {
  return (
    <div className="text-center space-y-4 pt-8">
      <div className="flex items-center justify-center gap-2">
        <Heart className="h-8 w-8 text-pink-500" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
          Namerr
        </h1>
        <Heart className="h-8 w-8 text-pink-500" />
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Find the perfect name for your little one. Get suggestions, feedback and
        discover similar names that match your style.
      </p>
    </div>
  );
}
