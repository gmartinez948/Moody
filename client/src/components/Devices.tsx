import { setSpotifyDevice } from "../hooks/getDevices";

export interface DevicesProps {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export const Devices = ({
  devices,
  token,
}: {
  devices: DevicesProps[];
  token: string | null;
}) => {
  return (
    <div>
      <h1>Choose a device to play music on</h1>
      <p>Upon choosing, the page will reload and you can try again</p>
      {devices.map((device: any) => {
        return (
          <button
            key={device.id}
            onClick={() => {
              if (token) {
                setSpotifyDevice(device.id, token);
              }
            }}
          >
            {device.name}
          </button>
        );
      })}
    </div>
  );
};
