import 'package:flutter/material.dart';
import 'package:herhack/pages/driver_home.dart';
import 'package:herhack/pages/passenger_home.dart';

class LoginPage extends StatelessWidget {
  final phoneNumController = TextEditingController();
  final passwordController = TextEditingController();

  DecorationImage _buildBackgroundImage() {
    return DecorationImage(
      fit: BoxFit.cover,
      colorFilter:
          ColorFilter.mode(Colors.black.withOpacity(1), BlendMode.dstATop),
      image: AssetImage('images/background.jpg'),
    );
  }

  Widget _userInput(
      String label, String data, bool pw, TextEditingController controller) {
    return TextFormField(
        controller: controller,
        style: TextStyle(color: Colors.white70),
        obscureText: pw,
        decoration: InputDecoration(
            labelText: label,
            labelStyle: TextStyle(color: Colors.white),
            focusedBorder: InputBorder.none,
            filled: true,
            fillColor: Colors.black54));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
      decoration: BoxDecoration(
        image: _buildBackgroundImage(),
      ),
      padding: EdgeInsets.all(30.0),
      child: Center(
        child: SingleChildScrollView(
          child: Container(
            child: Form(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  _userInput(
                      "Phone Num: ", "userName", false, phoneNumController),
                  SizedBox(
                    height: 10.0,
                  ),
                  _userInput(
                      "Password: ", "password", true, passwordController),
                  SizedBox(
                    height: 10.0,
                  ),
                  Container(
                      height: 60,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: <Widget>[
                          Container(
                            width: 150,
                            height: 40,
                            child: FlatButton(
                              color: Colors.red,
                              textColor: Colors.white,
                              child: Text('Passenger Login'),
                              onPressed: () => Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          PassengerHomePage())),
                            ),
                          ),
                          Container(
                              width: 150,
                              height: 40,
                              child: FlatButton(
                                color: Colors.red,
                                textColor: Colors.white,
                                child: Text('Driver Login'),
                                onPressed: () => Navigator.pushReplacement(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => DriverHomePage(
                                            phoneNumController.text))),
                              )),
                        ],
                      ))
                ],
              ),
            ),
          ),
        ),
      ),
    ));
  }
}
