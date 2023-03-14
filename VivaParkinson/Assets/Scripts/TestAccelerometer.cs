using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestAccelerometer : MonoBehaviour
{
    private void Start()
    {
        Accelerometer.Instance.OnShake += ActionToRunWhenShakingDevice;
    }

    private void onDestroy()
    {
        Accelerometer.Instance.OnShake -= ActionToRunWhenShakingDevice;
    }

    private void ActionToRunWhenShakingDevice()
    {

    }

    private void ActionToRunWhenDoneFading()
    {

    }
}
