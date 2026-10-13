import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IProduct } from '@/types/api_types';

const DeleteConfirmationDialog = ({
  productToDelete,
  onCancel,
  onConfirm,
}: {
  productToDelete: IProduct | null;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={productToDelete !== null} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {productToDelete?.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            The product will be removed from the catalog and the storefront. You can&apos;t undo
            this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep product</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red text-white hover:bg-red/90">
            Delete product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
