export default function ActivityList({ activities }: { activities: any[] }) {
  return (
    <div className="p-6 transparent-bg shadow rounded max-h-[70vh] overflow-y-auto hide-scrollbar">
      <h2 className="text-xl font-bold mb-4 text-center">Activity History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="p-4 rounded cursor-pointer shadow"
            style={{ backgroundColor: activity.highlightColor }}
            onClick={() => window.open(activity.pgcrLink, '_blank')}
          >
            <h3 className="text-lg font-bold">{activity.name}</h3>
            <p className="text-sm">{activity.mode}</p>
            <p className="text-sm">{activity.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
}