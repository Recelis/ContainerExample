interface IHeaderProps {
  isSignedIn: boolean;
  handleSignout: () => void;
}

export default function Header(props: IHeaderProps) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "var(--background-color)",
        paddingBlock: "1rem",
        paddingInline: "1rem",
        opacity: 0.87,
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>
        Container Example
      </span>
      <span style={{ display: "flex", gap: "1rem" }}>
        {props.isSignedIn && (
          <button onClick={() => props.handleSignout()}>Sign out</button>
        )}
      </span>
    </div>
  );
}
