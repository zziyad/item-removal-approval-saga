
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { RemovalReason, RemovalTerm } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

interface FormData {
  term: RemovalTerm;
  dateFrom: Date;
  dateTo?: Date;
  targetDepartment?: string;
  employee?: string;
  itemDescription: string;
  removalReasonId: string;
  customReason?: string;
  images: { id: string; url: string }[];
}

const RemovalRequestForm = () => {
  const { addRequest, removalReasons } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    term: "RETURNABLE",
    dateFrom: new Date(),
    itemDescription: "",
    removalReasonId: "",
    images: [],
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form field changes
  const handleChange = (
    field: keyof FormData,
    value: string | Date | undefined | { id: string; url: string }[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear related fields when changing term
    if (field === "term") {
      if (value === "RETURNABLE") {
        setFormData((prev) => ({ 
          ...prev, 
          term: "RETURNABLE", 
          employee: undefined,
        }));
      } else {
        setFormData((prev) => ({ 
          ...prev, 
          term: "NON_RETURNABLE", 
          dateTo: undefined,
          targetDepartment: undefined,
        }));
      }
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const imageUrl = event.target.result as string;
            setFormData((prev) => ({
              ...prev,
              images: [
                ...prev.images,
                { id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, url: imageUrl },
              ],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Remove image
  const removeImage = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const requestId = addRequest(formData);
      
      if (requestId) {
        navigate(`/request/${requestId}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle next/previous step navigation
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic details */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Item Details</h2>
                
                <div>
                  <Label>Removal Terms</Label>
                  <RadioGroup
                    value={formData.term}
                    onValueChange={(value) => handleChange("term", value as RemovalTerm)}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="RETURNABLE" id="returnable" />
                      <Label htmlFor="returnable">Returnable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="NON_RETURNABLE" id="non-returnable" />
                      <Label htmlFor="non-returnable">Non-Returnable</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="dateFrom">Date From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateFrom ? (
                          format(formData.dateFrom, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dateFrom}
                        onSelect={(date) => handleChange("dateFrom", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {formData.term === "RETURNABLE" && (
                  <>
                    <div>
                      <Label htmlFor="dateTo">Date To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-1"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dateTo ? (
                              format(formData.dateTo, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.dateTo}
                            onSelect={(date) => handleChange("dateTo", date)}
                            initialFocus
                            fromDate={formData.dateFrom}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label htmlFor="targetDepartment">Target Department</Label>
                      <Input
                        id="targetDepartment"
                        value={formData.targetDepartment || ""}
                        onChange={(e) => handleChange("targetDepartment", e.target.value)}
                        placeholder="Enter department name"
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
                
                {formData.term === "NON_RETURNABLE" && (
                  <div>
                    <Label htmlFor="employee">Employee (Sender)</Label>
                    <Input
                      id="employee"
                      value={formData.employee || ""}
                      onChange={(e) => handleChange("employee", e.target.value)}
                      placeholder="Enter employee name"
                      className="mt-1"
                    />
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Item description and reason */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Item Description</h2>
                
                <div>
                  <Label htmlFor="itemDescription">Item Description</Label>
                  <Textarea
                    id="itemDescription"
                    value={formData.itemDescription}
                    onChange={(e) => handleChange("itemDescription", e.target.value)}
                    placeholder="Describe the item in detail"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="removalReason">Removal Reason</Label>
                  <Select
                    value={formData.removalReasonId}
                    onValueChange={(value) => handleChange("removalReasonId", value)}
                    required
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {removalReasons.map((reason: RemovalReason) => (
                        <SelectItem key={reason.id} value={reason.id}>
                          {reason.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.removalReasonId === "6" && (
                  <div>
                    <Label htmlFor="customReason">Custom Reason</Label>
                    <Textarea
                      id="customReason"
                      value={formData.customReason || ""}
                      onChange={(e) => handleChange("customReason", e.target.value)}
                      placeholder="Enter your custom reason"
                      className="mt-1"
                      required
                    />
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Image upload and review */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Images & Review</h2>
                
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple
                    className="mt-1"
                  />
                </div>
                
                {formData.images.length > 0 && (
                  <div>
                    <Label>Uploaded Images ({formData.images.length})</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {formData.images.map((image) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.url}
                            alt="Uploaded item"
                            className="h-24 w-full object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">Form Summary</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <span className="font-medium">Term:</span> {formData.term === "RETURNABLE" ? "Returnable" : "Non-Returnable"}
                    </li>
                    <li>
                      <span className="font-medium">Date From:</span> {formData.dateFrom?.toLocaleDateString()}
                    </li>
                    {formData.term === "RETURNABLE" && (
                      <>
                        <li>
                          <span className="font-medium">Date To:</span> {formData.dateTo?.toLocaleDateString() || "Not specified"}
                        </li>
                        <li>
                          <span className="font-medium">Target Department:</span> {formData.targetDepartment || "Not specified"}
                        </li>
                      </>
                    )}
                    {formData.term === "NON_RETURNABLE" && (
                      <li>
                        <span className="font-medium">Employee (Sender):</span> {formData.employee || "Not specified"}
                      </li>
                    )}
                    <li>
                      <span className="font-medium">Item Description:</span> {formData.itemDescription || "Not provided"}
                    </li>
                    <li>
                      <span className="font-medium">Removal Reason:</span> {
                        formData.removalReasonId 
                          ? removalReasons.find(r => r.id === formData.removalReasonId)?.name 
                          : "Not selected"
                      }
                    </li>
                    {formData.removalReasonId === "6" && (
                      <li>
                        <span className="font-medium">Custom Reason:</span> {formData.customReason || "Not provided"}
                      </li>
                    )}
                    <li>
                      <span className="font-medium">Images:</span> {formData.images.length} uploaded
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RemovalRequestForm;
