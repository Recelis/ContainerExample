interface IContainerLoggedInProps {
  accessToken: string;
}

export default function ContainerLoggedIn(props: IContainerLoggedInProps) {
  console.log(props);
  return <div>Logged into ContainerExample</div>;
}
