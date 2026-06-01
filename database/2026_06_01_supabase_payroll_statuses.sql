-- Allow the deployed Supabase payroll workflow to use the same status names as the UI.
ALTER TABLE payroll_batches
  DROP CONSTRAINT IF EXISTS payroll_batches_status_check;

ALTER TABLE payroll_batches
  ADD CONSTRAINT payroll_batches_status_check
  CHECK (status IN (
    'Draft',
    'Ready for Submission',
    'Submitted for Validation',
    'Returned for Correction',
    'Validated',
    'Pending Manager Approval',
    'Approved',
    'Rejected',
    'Released'
  ));
