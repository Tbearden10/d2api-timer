import MembershipCard from './MembershipCard';

interface MembershipListProps {
  memberships: Array<{
    membershipId: string;
    membershipType: number;
    bungieGlobalDisplayName: string;
    bungieGlobalDisplayNameCode: string;
  }>;
  onSelectMembership: (membership: any) => void;
}

export default function MembershipList({ memberships, onSelectMembership }: MembershipListProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-center text-gray-300 mb-4">Membership List</h2>
      <ul className="space-y-4">
        {memberships.map((membership) => (
          <li key={membership.membershipId}>
            <MembershipCard
              membership={{
                ...membership,
                bungieGlobalDisplayName: membership.bungieGlobalDisplayName,
                bungieGlobalDisplayNameCode: membership.bungieGlobalDisplayNameCode,
              }}
              onClick={onSelectMembership}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}