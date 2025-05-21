import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const FormField = ({ 
  label, 
  name, 
  register, 
  error, 
  isTextArea = false, 
  ...props 
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    {isTextArea ? (
      <Textarea
        id={name}
        {...register(name)}
        className={error ? "border-red-500" : ""}
        {...props}
      />
    ) : (
      <Input
        id={name}
        {...register(name)}
        className={error ? "border-red-500" : ""}
        {...props}
      />
    )}
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
)