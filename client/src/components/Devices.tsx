import { Dispatch, SetStateAction } from "react";
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
  setDeviceId,
}: {
  devices: DevicesProps[];
  token: string | null;
  setDeviceId: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div>
      <h1>Choose a device to play music on</h1>
      {devices.map((device: DevicesProps) => {
        return (
          <button
            key={device.id}
            onClick={() => {
              if (token) {
                // setSpotifyDevice(device.id, token).then(() =>
                //   setDeviceId(device.id)
                // );
                setDeviceId(device.id);
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
