//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Changes to this file may cause incorrect behavior and
//     will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
using System;
namespace Utilities.Courses {
public partial class QHelper : IQHelper {
public static string Q1(Random random, Action<string, ushort> registerAnswer, bool isProof) {
var q = Quest_Q1(random, isProof);
string rval = q.GetQuestion(registerAnswer);
return rval;
} // Q1
public static TrueFalseQuestion Quest_Q1(Random random, bool isProof)
{
var q = new XyzQuestion(random, isProof);
q.Id = "Q1";
q.Marks = 4;
q.ShowMarks = false;
q.Stem = @"<p>Which of these films is part of the <em>Indiana Jones</em> movie franchise?</p>";
q.AddCorrects(
   @"<p>Radiers of the Lost Ark</p>",
   @"<p>Temple of Doom</p>",
   @"<p>The Last Crusade</p>",
   @"<p>Kingdom of the Crystal Skull</p>"
);
q.AddIncorrects(
   @"<p>The Empire Strikes Back</p>",
   @"<p>Patriots Game</p>",
   @"<p>Blade Runner</p>",
   @"<p>The Fugitive</p>"
);
return q;
} // Quest_Q1
} // class
} // namespace
