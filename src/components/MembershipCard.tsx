interface MembershipCardProps {
  membership: {
    membershipId: string;
    membershipType: number;
    bungieGlobalDisplayName: string;
    bungieGlobalDisplayNameCode: string;
  };
  onClick: (membership: any) => void;
}

// Function to map membershipType to platform name
function getPlatformName(membershipType: number): string {
  switch (membershipType) {
    case 0:
      return 'None';
    case 1:
      return 'Xbox';
    case 2:
      return 'PlayStation';
    case 3:
      return 'Steam';
    case 4:
      return 'Blizzard';
    case 5:
      return 'Stadia';
    case 6:
      return 'Egs';
    case 10:
      return 'Demon';
    case 254:
      return 'Next';
    case -1:
      return 'All';
    default:
      return 'Unknown';
  }
}

export default function MembershipCard({ membership, onClick }: MembershipCardProps) {
  return (
    <div
      onClick={() => onClick(membership)}
      className="p-4 bg-gray-800 text-white rounded cursor-pointer hover:bg-gray-700 transition glow-border"
    >
      <p>
        <strong>Name:</strong> {membership.bungieGlobalDisplayName + ' #' + membership.bungieGlobalDisplayNameCode}
      </p>
      <p>
        <strong>Membership ID:</strong> {membership.membershipId}
      </p>
      <p>
        <strong>Platform:</strong> {getPlatformName(membership.membershipType)}
      </p>
    </div>
  );
}