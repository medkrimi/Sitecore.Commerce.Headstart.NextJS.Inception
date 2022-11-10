export default function formatStatus(status: string): string {
  switch (status) {
    case "Unsubmitted":
      return "Unsubmitted"
    case "AwaitingApproval":
      return "AwaitingApproval"
    case "Declined":
      return "Declined"
    case "Open":
      return "Open"
    case "Completed":
      return "Completed"
    case "Canceled":
      return "Canceled"
    default:
      return "Completed"
  }
}
//<Icon as={HiOutlineFolderOpen} />
