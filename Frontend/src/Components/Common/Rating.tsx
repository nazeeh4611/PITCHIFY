// export interface BusinessModel {
//     _id: string;
//     businessName: string;
//     tagline: string;
//     fundinggoal: string;
//     targetAudience: string;
//     solution: string;
//     problemStatement: string;
//     useOfFunds: string;
//     marketOpportunities: string;
//     teamexpertise: string;
//     pitchvideo: string;
//     industryFocus: {
//       categoryname: string;
//       image: string;
//       is_Listed: boolean;
//     };
//     createdAt: string;
//   }
  
//   // RatingModal.tsx
//   import React, { useState } from 'react';
//   import { 
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//   } from "@/components/ui/dialog";
//   import { Button } from "@/components/ui/button";
//   import { Textarea } from "@/components/ui/textarea";
//   import { Star } from 'lucide-react';
//   import axios from 'axios';
//   import { baseurl } from '../constants/regex';
  
//   interface RatingModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     businessId: string;
//   }
  
//   const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, businessId }) => {
//     const [rating, setRating] = useState(0);
//     const [hoveredRating, setHoveredRating] = useState(0);
//     const [review, setReview] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
  
//     const handleSubmit = async () => {
//       if (rating === 0) {
//         setError('Please select a rating');
//         return;
//       }
      
//       setIsSubmitting(true);
//       setError('');
      
//       try {
//         const api = axios.create({
//           baseURL: baseurl,
//           headers: {
//             'Content-Type': 'application/json',
//             // Add any authentication headers if needed
//             // 'Authorization': `Bearer ${token}`
//           }
//         });
  
//         await api.post('/investor/submit-rating', {
//           businessId,
//           rating,
//           review
//         });
  
//         // Reset form
//         setRating(0);
//         setReview('');
//         onClose();
//       } catch (error) {
//         console.error('Error submitting rating:', error);
//         setError('Failed to submit rating. Please try again.');
//       } finally {
//         setIsSubmitting(false);
//       }
//     };
  
//     const handleClose = () => {
//       setRating(0);
//       setReview('');
//       setError('');
//       onClose();
//     };
  
//     return (
//       <Dialog open={isOpen} onOpenChange={handleClose}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Rate this Business</DialogTitle>
//           </DialogHeader>
          
//           <div className="flex flex-col gap-4 py-4">
//             {/* Star Rating */}
//             <div className="flex flex-col items-center gap-2">
//               <div className="flex justify-center gap-2">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     className="focus:outline-none"
//                     onMouseEnter={() => setHoveredRating(star)}
//                     onMouseLeave={() => setHoveredRating(0)}
//                     onClick={() => setRating(star)}
//                   >
//                     <Star
//                       size={32}
//                       className={`transition-colors ${
//                         star <= (hoveredRating || rating)
//                           ? 'fill-yellow-400 text-yellow-400'
//                           : 'fill-none text-gray-300'
//                       }`}
//                     />
//                   </button>
//                 ))}
//               </div>
//               <span className="text-sm text-gray-500">
//                 {rating ? `You selected ${rating} star${rating !== 1 ? 's' : ''}` : 'Select your rating'}
//               </span>
//             </div>
            
//             {/* Review Text Area */}
//             <Textarea
//               placeholder="Write your review here (optional)"
//               value={review}
//               onChange={(e) => setReview(e.target.value)}
//               className="min-h-32"
//             />
  
//             {error && (
//               <p className="text-sm text-red-500">{error}</p>
//             )}
//           </div>
  
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={handleClose}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit Rating'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     );
//   };
  
//   export default RatingModal;
  