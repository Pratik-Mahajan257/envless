import Link from "next/link";
import { clsx } from "clsx";
import {
  GitBranchPlus,
  Settings2,
  Shield,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";

const isVowel = (word) => {
  return /[aeiou]/.test(word.charAt(0));
};

const actions = [
  {
    type: "created.project",
    icon: ShieldCheck,
    bg: "bg-teal-100",
    color: "text-teal-500",
  },
  {
    type: "created.access",
    icon: UserPlus,
    bg: "bg-indigo-100",
    color: "text-indigo-500",
  },
  {
    type: "updated.account",
    icon: Settings2,
    bg: "bg-indigo-100",
    color: "text-indigo-500",
  },
  {
    type: "created.branch",
    icon: GitBranchPlus,
    bg: "bg-orange-100",
    color: "text-orange-500",
  },
];

const renderIcon = (log) => {
  const action = actions.find((e) => e.type === log.action);
  const Icon = action?.icon || Shield;

  return (
    <div
      className={clsx(
        action?.bg,
        "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-dark",
      )}
    >
      <Icon
        className={clsx(action?.color, "h-5 w-5 text-darkest")}
        aria-hidden="true"
      />
    </div>
  );
};

export default function AuditLogs({ logs, user }) {
  const description = (log) => {
    const project = log.project;
    const createdBy = log.createdBy;
    const createdFor = log.createdFor;

    const projectLink = () => (
      <Link
        className="text-xs text-teal-300 hover:underline"
        href={`/projects/${project.id}`}
      >
        {project.name}
      </Link>
    );

    switch (log.action) {
      case "created.project":
        return <>created {projectLink()} project</>;
      case "created.branch":
        return (
          <>
            created a{" "}
            <span className="font-semibold">{log.data.branch.name}</span> branch
            on {projectLink()} project
          </>
        );
      case "created.access":
        const role = log.data.access.role;
        const name =
          createdFor.id === user.id
            ? "yourself"
            : createdFor.name || createdFor.email;

        return (
          <>
            added {name} as {isVowel(role) ? "an" : "a"} {role} of{" "}
            {projectLink()} project
          </>
        );
      case "updated.account":
        return (
          <>
            updated your{" "}
            <Link
              className="text-xs text-teal-300 hover:underline"
              href="/settings"
            >
              account.
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {logs.map((log, idx) => (
          <li key={log.id}>
            <div className="relative pb-4">
              {idx !== logs.length - 1 ? (
                <span
                  className="absolute left-4 -ml-px h-full w-0.5 bg-dark"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">{renderIcon(log)}</div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-lightest">
                        {log.createdById === user.id
                          ? "You"
                          : log.createdBy.name || log.createdBy.email}{" "}
                        {description(log)}
                      </span>
                    </div>
                  </div>
                  <DateTimeAgo
                    className="mt-0.5 text-xs text-light"
                    date={log.createdAt}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
